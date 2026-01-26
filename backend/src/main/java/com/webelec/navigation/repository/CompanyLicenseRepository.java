package com.webelec.navigation.repository;

import com.webelec.navigation.domain.CompanyLicense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyLicenseRepository extends JpaRepository<CompanyLicense, Long> {

    List<CompanyLicense> findByCompanyId(Long companyId);
}
